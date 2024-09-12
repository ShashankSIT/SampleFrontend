import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { LanguageModel } from 'src/app/core/model/common-model';
import { UserDetailModel } from 'src/app/core/model/userprofile-model';
import { CommonService } from 'src/app/core/services/common.service';
import {
  StorageKey,
  StorageService,
} from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  constructor(
    private apiUrl: ApiUrlHelper,
    private commonService: CommonService,
  ) {}

  userProfileForm: FormGroup;
  photoUrl: string =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s';
  profileHave: boolean = false;
  isEdit: boolean = false;
  languages: Array<LanguageModel> = [];
  selectLanguageIds: string = '';

  //user profile model
  userProfile: UserDetailModel;

  ngOnInit() {
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
    this.userProfileForm = new FormGroup({
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
      phoneNo: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      gender: new FormControl(null,{ validators : [Validators.required], updateOn : 'blur'}),
      dob: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      languages: new FormControl(this.selectLanguageIds, [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.userProfileForm.valid) {
      return false;
    }

    const dobParts = this.userProfileForm.value.dob.split('-');
    const formattedDob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;

    this.userProfile.FirstName = this.userProfileForm.value.firstName;
    this.userProfile.LastName = this.userProfileForm.value.lastName;
    this.userProfile.Email = this.userProfileForm.value.email;
    this.userProfile.PhoneNo = this.userProfileForm.value.phoneNo;
    this.userProfile.Gender = this.userProfileForm.value.gender;
    this.userProfile.DOB = this.userProfileForm.value.dob;
    this.userProfile.Address = this.userProfileForm.value.address;
    this.userProfile.Languages = this.selectLanguageIds;

    //for the setting the
    //for the user Profile
    this.userProfile.UserPhoto = this.photoUrl;
    this.saveUserProfileDetail(this.userProfile);
    this.setLangugesAfterSubmit();

    this.isEdit = false;
    return true;
  }

  onEditProfile() {
    this.isEdit = true;
    const dob = new Date(this.userProfile.DOB);
    const formattedDob = dob.toISOString().split('T')[0];

    this.userProfileForm.patchValue({
      firstName: this.userProfile.FirstName,
      lastName: this.userProfile.LastName,
      email: this.userProfile.Email,
      phoneNo: this.userProfile.PhoneNo,
      gender: this.userProfile.Gender || null,
      dob: this.userProfile.DOB,
      address: this.userProfile.Address,
      userPhoto: this.userProfile.UserPhoto || this.photoUrl,
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

  //set the languages in the userProfileData in Formatting the Languages based on the ID
  setLangugesAfterSubmit() {
    const languagesIds = this.userProfile.Languages.split(',');

    const FormateLanguages = languagesIds.map((Id) => {
      return this.languages.find((lang) => lang.Id === Number(Id)).Language;
    });

    this.userProfile.FormatLanguages = FormateLanguages;
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

      // LoggedInUserId: 1,
      // LoggedInEmailId: "",
      // IsActive: true,
      // IsDelete: true,
      // CreatedBy: 0 ,
      // CreatedOn: "",
      // StrCreatedOn: "",
      // UpdatedBy: 0,
      // UpdatedOn: "",
      // StrUpdatedOn: "" ,
      // LoginToken: "" ,
      // BranchId: 0
    };
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.userProfile = data.Data || [];
            this.setLangugesAfterSubmit();
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  saveUserProfileDetail(obj: any) {
    const apiUrl = this.apiUrl.apiUrl.userprofile.saveUserProfileDetail;
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.userProfile.UserDetailId = data.Data.UserDetailId  
          }
        },
        error: (err) => [console.error(err)],
      });
  }
}
