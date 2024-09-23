import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debug, error } from 'console';
import { read } from 'fs';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { LanguageModel } from 'src/app/core/model/common-model';
import {
  AddressModel,
  CityModel,
  CountryModel,
  StateModel,
  UserDetailModel,
} from 'src/app/core/model/userprofile-model';
import { CommonService } from 'src/app/core/services/common.service';
import { CustomValidator } from 'src/app/core/validators/CustomValidator.validators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  constructor(
    private apiUrl: ApiUrlHelper,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) {}

  // Fields
  userProfileForm: FormGroup;
  photoUrl: string =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s';
  profileHave: boolean = false;
  isEdit: boolean = false;
  languages: Array<LanguageModel> = [];
  selectLanguageIds: string = '';
  isreadonly: boolean = false;

  addressArray: Array<AddressModel> = [];
  deleteAddressArray: Array<AddressModel> = [];

  countryList: Array<CountryModel> = [];
  stateList: Array<Array<StateModel>> = [];
  cityList: Array<Array<CityModel>> = [];
  //temp store profileData
  ProfileData: File;
  //user profile model
  userProfile: UserDetailModel;
  isSubmit: boolean = false;
  ngOnInit() {
    this.isreadonly = !this.isreadonly;
    this.getLanguageList();
    this.getUserDetailById();
    this.getCountryList();
    this.setForm();
  }
  get userFormControl() {
    return this.userProfileForm.controls;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.profileHave = true;

      //set the profileData for the sending to backend file
      this.ProfileData = input.files[0];

      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.photoUrl = e.target.result as string;

          //for the onload userPhoto value is change
          this.userProfileForm.patchValue({
            userPhoto: this.photoUrl,
          });
        }
      };

      reader.readAsDataURL(file);
    } else {
      // Handle the case when no file is selected
      this.photoUrl = this.photoUrl; // Fallback to the sample photo

      this.userProfileForm.patchValue({
        userPhoto: null,
      });
    }
  }

  //set the value of the form
  setForm() {
    var today = new Date();

    this.userProfileForm = this.fb.group({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
        CustomValidator.onlyAlphabetAllowed,
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
        CustomValidator.onlyAlphabetAllowed,
      ]),
      userPhoto: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNo: [
        null,
        [
          Validators.required,
          CustomValidator.maxLengthValidator(10),
          CustomValidator.minLengthValidator(10),
        ],
      ],
      gender: new FormControl(null, {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      dob: new FormControl(null, [
        Validators.required,
        CustomValidator.futureDateValidator(),
      ]),
      address: new FormArray([]),
      languages: new FormControl(this.selectLanguageIds, [Validators.required]),
    });
  }

  get address(): FormArray {
    return this.userProfileForm.get('address') as FormArray;
  }
  //for the multiple address
  AddAddress() {
    (<FormArray>this.userProfileForm.get('address')).push(
      new FormGroup({
        AddressId: new FormControl(null),
        Address1: new FormControl(null, [
          Validators.required,
          CustomValidator.noSpaceAllowed,
        ]),
        Address2: new FormControl(null),
        CountryId: new FormControl('', Validators.required),
        StateId: new FormControl('', Validators.required),
        CityId: new FormControl('', Validators.required),
        IsDelete: new FormControl(null),
      }),
    );
  }

  removeAddress(i: number) {
    const a = this.userProfileForm.get('address') as FormArray;
    const address = a.at(i);
    if (address) {
      address.value.IsDelete = true;
      if (i < this.addressArray.length) {
        this.addressArray[i].IsDelete = true;
      }

      if (this.addressArray[i]?.Address1 != null) {
        if (address.value.Address1.trim() === '') {
          address[i] = this.addressArray[i];
        }
        debugger;
        this.deleteAddressArray.push(address.value);
      }
      a.removeAt(i);
    } else {
      this.userProfileForm.get('address').value[i].IsDelete = false;
      a.removeAt(i);
      if (i < this.addressArray.length) {
        this.addressArray[i].IsDelete = false;
        this.addressArray.splice(i, 1);
      }
    }
    console.log(this.userProfileForm.get('address').value);
  }

  //Get CountryList
  getCountryList() {
    const apiUrl = this.apiUrl.apiUrl.userprofile.getCountryList;

    this.commonService
      .doGet(apiUrl)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.countryList = data.Data;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onCountryChnage(event: any, index: number) {
    this.stateList[index] = [];
    this.cityList[index] = [];
    if (event.target.value != '') {
      this.getStateList(event.target.value, index);
    } else {
      return;
    }
  }

  onStateChange(event: any, index: number) {
    this.cityList[index] = [];
    if (event.target.value != '' || null) {
      this.getCityList(event.target.value, index);
    } else {
      return;
    }
  }

  getStateList(CountryId: any, index: number) {
    const apiUrl = this.apiUrl.apiUrl.userprofile.getStateListById;

    const obj = {
      CountryId: CountryId,
    };

    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.stateList[index] = data.Data;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCityList(StateId: any, index: number) {
    const apiUrl = this.apiUrl.apiUrl.userprofile.getCityListById;

    const obj = {
      StateId: StateId,
    };

    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.cityList[index] = data.Data;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onSubmit() {
    this.isSubmit = true;

    if (!this.userProfileForm.valid) {
      return false;
    }
    //for the current address form
    const address = this.userProfileForm.get('address') as FormArray;

    //for the current address value
    var addressValue = this.userProfileForm.get('address').value;
    debugger;
    console.log(this.deleteAddressArray);
    if (this.deleteAddressArray && this.deleteAddressArray.length !== 0) {
      var array = addressValue.concat(this.deleteAddressArray);
    } else {
      var array = addressValue;
    }
    //addess form field clear for the previous record
    address.clear();

    for (var a of array) {
      address.push(
        new FormGroup({
          AddressId: new FormControl(a.AddressId),
          Address1: new FormControl(a.Address1.trim(), [
            Validators.required,
            CustomValidator.noSpaceAllowed,
          ]),
          Address2: new FormControl(a?.Address2?.trim()),
          CountryId: new FormControl(a.CountryId, Validators.required),
          StateId: new FormControl(a.StateId, Validators.required),
          CityId: new FormControl(a.CityId, Validators.required),
          IsDelete: new FormControl(a.IsDelete),
        }),
      );
    }

    this.userProfileForm.get('address').patchValue(address.value);

    this.userProfile.FirstName = this.userProfileForm.value.firstName.trim();
    this.userProfile.LastName = this.userProfileForm.value.lastName.trim();
    this.userProfile.PhoneNo = this.userProfileForm.value.phoneNo;
    this.userProfile.Gender = this.userProfileForm.value.gender;
    this.userProfile.DOB = this.userProfileForm.value.dob;
    this.userProfile.Address = this.userProfileForm.value.address;
    this.userProfile.Languages =
      this.userProfileForm.value?.languages.toString();

    //for the setting the
    //for the user Profile
    this.saveUserProfileDetail();
    this.isEdit = false;
    return true;
  }

  onEditProfile() {
    this.isEdit = true;

    const address = this.userProfileForm.get('address') as FormArray;
    address.clear(); // Clear the existing FormArray
    this.addressArray.forEach((a: any, index: number) => {
      address.push(
        new FormGroup({
          AddressId: new FormControl(a.AddressId),
          Address1: new FormControl(a.Address1.trim(), [
            Validators.required,
            CustomValidator.noSpaceAllowed,
          ]),
          Address2: new FormControl(a?.Address2?.trim()),
          CountryId: new FormControl(a.CountryId, Validators.required),
          StateId: new FormControl(a.StateId, Validators.required),
          CityId: new FormControl(a.CityId, Validators.required),
          IsDelete: new FormControl(a.IsDelete),
        }),
      );

      this.onCountryChnage({ target: { value: a.CountryId } }, index);

      this.onStateChange({ target: { value: a.StateId } }, index);
    });

    this.userProfileForm.patchValue({
      firstName: this.userProfile.FirstName,
      lastName: this.userProfile.LastName,
      email: this.userProfile.Email,
      phoneNo: this.userProfile.PhoneNo,
      gender: this.userProfile.Gender || null,
      dob: this.userProfile.DOB,
      userPhoto:
        this.userProfile?.UserPhoto != null
          ? this.userProfile.UserPhoto
          : this.photoUrl,
      languages: this.userProfile.Languages?.split(',').map(Number), // maybe null
    });
  }

  getLanguageList() {
    const apiUrl = this.apiUrl.apiUrl.userprofile.getLanguageList;

    this.commonService
      .doGet(apiUrl)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.languages = data?.Data ?? [];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onChange(event: any) {
    this.selectLanguageIds = event.map((item: any) => item.Id).join(',');
  }

  //GetUserDetailById
  getUserDetailById() {
    const apiUrl = this.apiUrl.apiUrl.userprofile.getUserDetailById;
    const obj = {
      UserDetailId: 0,
      FirstName: ' ',
      LastName: ' ',
      Email: '',
      PhoneNo: 0,
      UserPhoto: '',
      Gender: '',
      DOB: '',
      Address: '',
      Languages: '',
      FormatLanguages: '',

      //Error - if Api is not hit end point then define the object like this
    };
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.userProfile = data.Data || [];
            this.userProfile.UserDetailId =
              data.Data.UserDetailId != 0 ? data.Data.UserDetailId : 0;
            this.photoUrl = data.Data.UserPhoto;

            this.addressArray = this.userProfile.Address;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  saveUserProfileDetail() {
    const apiUrl = this.apiUrl.apiUrl.userprofile.saveUserProfileDetail;
    const formData = new FormData();
    formData.append('UserDetailData', JSON.stringify(this.userProfile));
    formData.append('ProfileData', this.ProfileData);
    this.commonService
      .doPost(apiUrl, formData)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.userProfile.UserDetailId =
              data.Data.UserDetailId != 0 ? data.Data.UserDetailId : 0;
            this.getUserDetailById();
            this.deleteAddressArray = [];
          }
        },
        error: (err) => [console.error(err)],
      });
  }
}
