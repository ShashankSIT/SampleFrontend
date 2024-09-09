import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';

import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDragEndEvent,
} from 'ag-grid-community';
// import { EventService } from 'app/core/services/event.service';
// import { LanguageService } from 'app/core/services/language.service';
// import { LayoutSettingsService } from 'app/core/services/layout-settings.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  private gridApi!: GridApi;
  private columnApi!: ColumnApi;
  @Input() columnDefs: ColDef[] = [];
  @Output() onloadDataTable = new EventEmitter<any>();
  @Output() onPageSizeChangeTable = new EventEmitter<any>();
  @Output() onSortChangeTable = new EventEmitter<any>();
  @Output() onFilterChangeTable = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onGlobalSearch = new EventEmitter<string>();
  @Output() onReset = new EventEmitter<null>();
  @Output() onDateRangeValueSelect = new EventEmitter<any>();
  @Output() exportList = new EventEmitter<string>();
  @Output() SelectedRowsData = new EventEmitter<any>();
  @Output() onDeleteAll = new EventEmitter<any>();
  @Output() rowDragEnd = new EventEmitter<any>();
  @Output() addMultiItem = new EventEmitter<any[]>();
  @Output() selectedRows = new EventEmitter<any[]>();
  @Output() dataToSelectChange = new EventEmitter<any>();
  @Input() dataToSelect: any;
  @Input() rowData: any = [];
  @Input() listName: string = 'listName';
  @Input() perPage = 10;
  @Input() currentPage = 1;
  @Input() collectionSize = 1;
  @Input() maxHeight: string = '';
  @Input() filterText = '';
  @Input() sortField = 'id';
  @Input() sortOrder = 'asc';
  @Input() isPaginationEnable = true;
  @Input() resetFilters = true;
  @Input() isPrintEnable = true;
  @Input() isExportable = true;
  @Input() isDeletable = false;
  @Input() isDeleteAll = false;
  @Input() isSearchable = true;
  @Input() isDateRangeSelectionOn = false;
  @Input() paginationPosition: 'top' | 'bottom' | 'both' = 'bottom';
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  @Input() rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' =
    'always';
  @Input() isAddProduct = false;
  numberOfSelectedRows: number = 0;
  @Input() defaultColDef: ColDef = {
    editable: false,
    enableRowGroup: false,
    enablePivot: false,
    enableValue: true,
    sortable: true,
    resizable: false,
    filter: true,
    flex: 1,
    pinned: false,
    lockPinned: true,
    minWidth: 50,
    valueFormatter: (params) => (params.value ? params.value : ' - '),
  };
  @Input() gridOptions: GridOptions = {
    rowHeight: 50,
    headerHeight: 40,
  };

  @Input() events!: Observable<void>;
  eventsSubscription!: Subscription;
  rounded = 1;
  pageSizeOptions: { pageSize: string; value: number | string }[] = [
    { pageSize: 'All', value: 'all' },
    { pageSize: '10', value: 10 },
    { pageSize: '15', value: 15 },
    { pageSize: '25', value: 25 },
    { pageSize: '50', value: 50 },
    { pageSize: '100', value: 100 },
  ];
  queryParamsSubject: Subject<string> = new Subject<string>();
  queryParams: string = '';
  dateRange: any;
  showGrid: boolean = true;
  @Input() isLoading: boolean = false;
  @ViewChild('grid') block!: ElementRef;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.setMaxHeight();
    this.pageSizeOptions[0].value = this.collectionSize;
    if (changes['dataToSelect']) {
      if (this.dataToSelect) {
        this.gridApi?.forEachNode((node) => {
          if (this.dataToSelect.includes(node.data._id)) {
            node.setSelected(true);
          }
        });
      }
    }
  }
  ngAfterViewInit(): void {
    this.setMaxHeight();
  }
  ngOnInit(): void {
    this.setMaxHeight();

    this.eventsSubscription = this.events?.subscribe(() =>
      this.gridApi.showLoadingOverlay(),
    );
    this.queryParamsSubject.pipe(debounceTime(500)).subscribe((val: string) => {
      this.onGlobalSearch.emit(val);
    });

    let newPinnedValue: any;
  }

  ngOnDestroy() {
    this.eventsSubscription?.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    if (localStorage.getItem(this.listName)) {
      this.columnApi.applyColumnState({
        state: JSON.parse(localStorage.getItem(this.listName) || '{}'),
        applyOrder: true,
      });
    }
    this.onloadDataTable.emit(params);
  }

  onPageSizeChanged() {
    this.pageSizeOptions[0].value = this.collectionSize;
    if (
      (this.perPage as any) === 'all' ||
      this.perPage === this.collectionSize
    ) {
      this.onPageSizeChangeTable.emit(this.collectionSize);
      // this.onPageSizeChangeTable.emit(); Important
    } else {
      this.onPageSizeChangeTable.emit(Number(this.perPage));
    }
    this.setMaxHeight();
  }

  onSortChange(event: any) {
    this.onSortChangeTable.emit(event);
  }

  onfilterChange(event: any) {
    const filterFields = Object.entries(this.gridApi.getFilterModel()).map(
      ([key, val]) => ({
        [key]: {
          $regex: val.filter.toString() ?? val.type.toString(),
          $options: 'i',
        },
      }),
    );
    this.onFilterChangeTable.emit(filterFields);
  }

  onPageClick(event: number) {
    this.onPageChange.emit(event);
  }

  onRowDragEnd(e: RowDragEndEvent) {
    const api = e.api;
    const rowDataArray: { _id: string; position: number }[] = [];
    const initialPosition = (this.currentPage - 1) * this.perPage + 1;
    let currentPosition = initialPosition;

    api?.forEachNode((node) => {
      const { _id } = node.data;
      rowDataArray.push({ _id, position: currentPosition });
      currentPosition++;
    });
    this.rowDragEnd.emit(rowDataArray);
  }

  onBtnExport() {
    // this.gridApi.exportDataAsCsv();
    this.exportList.emit('CSV');
  }

  onBtnPrint() {
    // FOR
    // const api = this.gridApi;
    // this.setPrinterFriendly(api);
    // setTimeout(() => {
    //   print();
    //   this.setNormal(api);
    // }, 2000);
    this.exportList.emit('PDF');
  }

  setPrinterFriendly(api: GridApi) {
    const eGridDiv = document.querySelector<HTMLElement>('#commonGrid')! as any;
    eGridDiv.style.height = '';
    api.setDomLayout('print');
  }

  setNormal(api: GridApi) {
    const eGridDiv = document.querySelector<HTMLElement>('#commonGrid')! as any;
    eGridDiv.style.height = '550px';
    api.setDomLayout();
  }

  onResetFilters() {
    // this.gridApi.showLoadingOverlay();
    // setTimeout(() => {
    //   this.gridApi.hideOverlay();
    // }, 3000);
    this.currentPage = 1;
    this.perPage = 10;
    this.queryParams = '';
    this.gridApi.setFilterModel(null);
    this.columnApi.resetColumnState();
    this.onReset.emit();
  }

  onColumnOrderChange() {
    if (this.columnApi) {
      const columnState = this.columnApi.getColumnState();
      const modifiedColumnState = columnState.map((column) => {
        const { pinned, ...newColumn } = column;
        return newColumn;
      });
      localStorage.setItem(this.listName, JSON.stringify(modifiedColumnState));
    }
  }

  setMaxHeight() {
    if (this.block) {
      const datas = this.block.nativeElement.getBoundingClientRect();
      const bodyWrapper: HTMLElement | null =
        document.querySelector('.ag-body-viewport');
      if (bodyWrapper) {
        //If we don't pass the max height, Then it'll be calculated dynamically.
        if (this.maxHeight) {
          bodyWrapper.style.maxHeight = this.maxHeight + 'px';
        } else {
          const calculatedMaxHeight =
            window.innerHeight - datas.top > 73
              ? window.innerHeight -
                datas.top -
                250 +
                (this.isPaginationEnable ? 40 : 100)
              : datas.top;
          bodyWrapper.style.maxHeight = calculatedMaxHeight + 'px';
        }
        bodyWrapper.style.overflow = 'auto';
      }
    }
  }
  getSelectedRowsData() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.SelectedRowsData.emit(selectedData);
    this.addSaleProduct(selectedData);
  }
  deleteAllData() {
    this.onDeleteAll.emit();
  }
  onDateRangeSelect() {
    this.onDateRangeValueSelect.emit(this.dateRange);
  }
  onSelectionChange() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    this.numberOfSelectedRows = selectedNodes.length;
    this.selectedRows.emit(selectedNodes);
  }
  addSaleProduct(selectedData: any[]) {
    this.addMultiItem.emit(selectedData);
  }
}
