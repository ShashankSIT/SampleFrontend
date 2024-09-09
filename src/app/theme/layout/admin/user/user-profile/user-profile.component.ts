import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  constructor() {}

  userProfileForm: FormGroup;
  photoUrl: string =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s';
  profileHave: boolean = false;
  isEdit: boolean = false;
  formStatus: string;

  userProfileData: any = {
    firstName: 'First Name Test',
    lastName: 'Last Name Test',
    userPhoto: this.photoUrl,
    email: 'test@gmail.com',
    phoneNo: 9099784578,
    dob: '02-12-2024',
    address: '',
  };

  ngOnInit() {
    this.userProfileForm = new FormGroup({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      userPhoto: new FormControl(this.photoUrl, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNo: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      dob: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
    });
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

  onSubmit() {
    if (!this.userProfileForm.valid) {
      return false;
    }

    const dobParts = this.userProfileForm.value.dob.split('-');
    const formattedDob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;

    this.userProfileData.firstName = this.userProfileForm.value.firstName;
    this.userProfileData.lastName = this.userProfileForm.value.lastName;
    this.userProfileData.email = this.userProfileForm.value.email;
    this.userProfileData.phoneNo = this.userProfileForm.value.phoneNo;
    debugger;
    this.userProfileData.dob = formattedDob;
    this.userProfileData.address = this.userProfileForm.value.address;

    //for the user Profile
    this.userProfileData.userPhoto = this.photoUrl;
    this.isEdit = false;
    return true;
  }

  onEditProfile() {
    this.isEdit = true;

    const dob = new Date(this.userProfileData.dob);
    const formattedDob = dob.toISOString().split('T')[0];

    this.userProfileForm.patchValue({
      firstName: this.userProfileData.firstName,
      lastName: this.userProfileData.lastName,
      email: this.userProfileData.email,
      phoneNo: this.userProfileData.phoneNo,
      dob: formattedDob,
      address: this.userProfileData.address,
    });
  }
}
