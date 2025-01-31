import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { weekOfYear } from 'ngx-bootstrap/chronos/units/week-calendar-utils';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { CommonService } from 'src/app/core/services/common.service';
import { noFutureDateValidator } from 'src/app/validators/date-validators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  userForm!: FormGroup;
  countries = [];
  userPhoto: string = '';
  coverPhoto: string = '';
  states = [];
  cities = [];
  bsConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    showWeekNumbers: false,
  };

  constructor(
    private apiUrl: ApiUrlHelper,
    private commonService: CommonService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.initUserForm();
    this.loadCountries();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      phoneNumber: [
        null,
        [Validators.required, Validators.pattern('^\\+?[0-9]{10,11}$')],
      ],
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null],
      country: [null],
      state: [null],
      city: [null],
      aboutMe: ['', Validators.maxLength(500)],
      gender: [null, Validators.required], // Add gender form control
      dateOfBirth: [null, [Validators.required, noFutureDateValidator()]], // Add dateOfBirth form control
    });
  }

  loadCountries() {
    this.commonService
      .doGet(this.apiUrl.apiUrl.cityStateCountry.getCountries)
      .subscribe({
        next: (response) => {
          if (response && response?.Data && response?.Data.length > 0) {
            this.countries = response.Data;
          }
        },
        error: (err) => console.error(err),
      });
  }

  onCountryChange(selectedCountry: { CountryId: number }) {
    if (selectedCountry.CountryId) {
      this.commonService
        .doGet(
          this.apiUrl.apiUrl.cityStateCountry.getStates +
            `?CountryId=${selectedCountry.CountryId}`,
        )
        .subscribe({
          next: (response) => {
            if (response && response?.Data && response?.Data.length > 0) {
              this.states = response.Data;
              this.cities = [];
              if (this.userForm.get('state').value) {
                this.onStateChange({
                  StateId: this.userForm.get('state').value,
                });
              }
            }
          },
          error: (err) => console.error(err),
        });
    }
  }

  onStateChange(selectedState: { StateId: number }) {
    if (selectedState.StateId) {
      this.commonService
        .doGet(
          this.apiUrl.apiUrl.cityStateCountry.getCities +
            `?StateId=${selectedState.StateId}`,
        )
        .subscribe({
          next: (response) => {
            if (response && response?.Data && response?.Data.length > 0) {
              this.cities = response.Data;
            }
          },
          error: (err) => console.error(err),
        });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const profileImage = document.getElementById(
          'profileImage',
        ) as HTMLImageElement;
        profileImage.src = e.target.result; // Update the image source with the selected file
      };

      reader.readAsDataURL(file); // Convert the image file to base64 URL
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      this.userForm.markAllAsTouched();
      return;
    }

    // Submit form logic here
    console.log('Form Submitted', this.userForm.value);
  }

  getUserData() {
    this.commonService
      .doPost(this.apiUrl.apiUrl.user.getUserDetailsList, {})
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data?.Data && data?.Data?.length > 0) {
            const userData = data.Data[0];

            this.userForm.patchValue({
              phoneNumber: userData.PhoneNo,
              email: userData.Email,
              firstName: userData.FirstName,
              lastName: userData.LastName,
              address: userData.Address,
              country: userData.CountryId, // Assuming you want to set country ID
              state: userData.StateId, // Assuming you want to set state ID
              city: userData.CityId, // Assuming you want to set city ID
              aboutMe: userData.AboutMe,
              gender: userData.Gender, // Add gender form control
              dateOfBirth: userData.DateOfBirth,
            });
            if (userData.CountryId) {
              this.onCountryChange({
                CountryId: userData.CountryId,
              });
            }
          }
        },
        error: (error: Error) => {},
      });
  }
  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // Programmatically click the file input
  }
  removeImage() {
    this.userPhoto = ''; // Clear the image
  }
}
