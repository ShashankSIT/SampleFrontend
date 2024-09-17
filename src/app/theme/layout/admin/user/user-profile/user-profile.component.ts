import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { error } from 'console';
import { read } from 'fs';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { LanguageModel } from 'src/app/core/model/common-model';
import {
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
  addressArray: Array<string> = [];
  countryList: Array<CountryModel> = [];
  stateList: Array<StateModel> = [];
  cityList: Array<CityModel> = [];
  //temp store profileData
  ProfileData: File;
  //user profile model
  userProfile: UserDetailModel;

  ngOnInit() {
    this.isreadonly = !this.isreadonly;
    this.getLanguageList();
    this.getUserDetailById();
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
    var todayTimestamp = today.getTime();

    this.userProfileForm = this.fb.group({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      userPhoto: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNo: [
        null,
        [Validators.required, CustomValidator.maxLengthValidator(10)],
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

  //for the multiple address
  AddAddress() {
    (<FormArray>this.userProfileForm.get('address')).push(
      new FormControl(null, Validators.required),
    );
    console.log(this.userProfileForm.get('address').value);
  }

  removeAddress(i: number) {
    const control = <FormArray>this.userProfileForm.get('address');
    control.removeAt(i);

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

  onCountryChnage(event: any) {
    this.getStateList(event.target.value);
  }

  onStateChange(event: any) {
    this.getCityList(event.target.value);
  }

  getStateList(CountryId: any) {
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
            this.stateList = data.Data;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCityList(StateId: any) {
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
            this.cityList = data.Data;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onSubmit() {
    if (!this.userProfileForm.valid) {
      return false;
    }
    this.userProfile.FirstName = this.userProfileForm.value.firstName.trim();
    this.userProfile.LastName = this.userProfileForm.value.lastName.trim();
    //this.userProfile.Email = this.userProfileForm.value.email;
    this.userProfile.PhoneNo = this.userProfileForm.value.phoneNo;
    this.userProfile.Gender = this.userProfileForm.value.gender;
    this.userProfile.DOB = this.userProfileForm.value.dob;
    this.userProfile.Address = this.userProfileForm.value.address.join();
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

    debugger;
    const addressArray = this.userProfileForm.get('address') as FormArray;
    addressArray.clear(); // Clear the existing FormArray

    // Split the Address string and add FormControls to the FormArray
    const addresses = this.userProfile.Address.split(',');
    addresses.forEach((address: string) => {
      addressArray.push(new FormControl(address.trim(), Validators.required)); // Add each address
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

    this.getCountryList();
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
            this.addressArray = data.Data.Address.split(',');
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
          }
        },
        error: (err) => [console.error(err)],
      });
  }
}
