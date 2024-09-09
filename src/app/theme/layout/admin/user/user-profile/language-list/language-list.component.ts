import { Component, OnInit } from '@angular/core';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { LanguageModel } from 'src/app/core/model/common-model';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrl: './language-list.component.scss',
})
export class LanguageListComponent implements OnInit {
  languges: Array<LanguageModel> = [];
  public settings = {};

  constructor(
    private commonService: CommonService,
    private apiUrl: ApiUrlHelper,
  ) {}

  ngOnInit(): void {
    this.getLanguageList();

    console.log(this.languges);

    this.settings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Language',
      enableCheckAll: true,
      selectAllText: 'Select all Languages',
      unSelectAllText: '',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      noDataAvailablePlaceholderText: 'Data is not available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  getLanguageList() {
    const apiUrl = this.apiUrl.apiUrl.user.getLanguageList;
    this.commonService
      .doGet(apiUrl)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.languges = data?.Data ?? [];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
