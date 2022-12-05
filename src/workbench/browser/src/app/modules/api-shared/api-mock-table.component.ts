import { Component, Input, OnChanges, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiData, ApiMockEntity } from '../../shared/services/storage/index.model';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { copyText, eoDeepCopy } from 'eo/workbench/browser/src/app/utils/index.utils';
import { ApiMockService } from 'eo/workbench/browser/src/app/pages/api/http/mock/api-mock.service';
import { ModalService } from 'eo/workbench/browser/src/app/shared/services/modal.service';
import { ApiMockEditComponent } from 'eo/workbench/browser/src/app/pages/api/http/mock/edit/api-mock-edit.component';

@Component({
  selector: 'eo-api-mock-table',
  template: ` <eo-ng-table-pro [columns]="mockListColumns" [nzData]="mockList"></eo-ng-table-pro>
    <ng-template #urlCell let-item="item" let-index="index">
      <span i18n-nzTooltipTitle nzTooltipTitle="Click to Copy" eoNgFeedbackTooltip (click)="copyText(item.url)">
        <span class="text-omit">{{ item.url }}</span>
      </span>
    </ng-template>`,
})
export class ApiMockTableComponent implements OnInit, OnChanges {
  @Input() canEdit = true;
  @Input() apiData: ApiData;

  @ViewChild('urlCell', { read: TemplateRef, static: true })
  urlCell: TemplateRef<any>;

  mockListColumns = [];
  mockPrefix: string;
  mockList: ApiMockEntity[] = [];

  constructor(
    private message: EoNgFeedbackMessageService,
    private modal: ModalService,
    private apiMock: ApiMockService
  ) {}

  ngOnInit() {
    this.initTable();
    this.mockPrefix = this.apiMock.getMockPrefix(this.apiData);
  }
  async handleDeleteMockItem(item, index) {
    await this.apiMock.deleteMock(item.uuid);
    this.mockList.splice(index, 1)[0];
    this.mockList = [...this.mockList];
    this.message.success($localize`Delete Succeeded`);
  }

  private initTable() {
    this.mockListColumns = [
      { title: $localize`Name`, key: 'name', width: 200 },
      {
        title: $localize`Created Type`,
        key: 'createWay',
        width: 150,
        enums: [
          { title: $localize`System creation`, value: 'system' },
          { title: $localize`Manual creation`, value: 'custom' },
        ],
      },
      { title: 'URL', slot: this.urlCell },
      {
        type: 'btnList',
        btns: [
          {
            title: $localize`Preview`,
            icon: 'preview-open',
            click: (item) => {
              const modal = this.modal.create({
                nzTitle: $localize`Preview Mock`,
                nzWidth: '70%',
                nzContent: ApiMockEditComponent,
                nzComponentParams: {
                  model: item.data,
                  isEdit: false,
                },
                nzFooter: [
                  {
                    label: $localize`Cancel`,
                    onClick: () => {
                      modal.destroy();
                    },
                  },
                ],
              });
            },
          },
          {
            action: 'edit',
            showFn: (item) => item.data.createWay !== 'system',
            click: (item, index) => {
              const modal = this.modal.create({
                nzTitle: $localize`Edit Mock`,
                nzWidth: '70%',
                nzContent: ApiMockEditComponent,
                nzComponentParams: {
                  model: eoDeepCopy(item.data),
                },
                nzOnOk: async () => {
                  await this.addOrEditModal(item.data, index);
                  modal.destroy();
                },
              });
            },
          },
          {
            action: 'delete',
            showFn: (item) => item.data.createWay !== 'system',
            confirm: true,
            confirmFn: (item, index) => {
              this.handleDeleteMockItem(item.data, index);
            },
          },
        ],
      },
    ];
  }
  async ngOnChanges(changes) {
    if (changes?.apiData?.currentValue) {
      this.mockList = await this.apiMock.getMocks(this.apiData.uuid);
      this.setMocksUrl();
    }
  }
  private setMocksUrl() {
    this.mockList.forEach((mock) => {
      mock.url = this.getMockUrl(mock);
    });
  }

  async copyText(text: string) {
    await copyText(text);
    this.message.success($localize`Copied`);
  }
  async addOrEditModal(item, index?) {
    if (item.uuid) {
      await this.apiMock.updateMock(item, Number(item.uuid));
      this.message.success($localize`Edited successfully`);
      this.mockList[index] = item;
    } else {
      const result = await this.apiMock.createMock(item);
      Object.assign(item, result.data, {
        createWay: 'custom',
      });
      this.message.success($localize`Added successfully`);
      this.mockList.push(item);
    }
    item.url = this.getMockUrl(item);
    //Use onPush to update data
    this.mockList = [...this.mockList];
  }

  private getMockUrl(mock) {
    //Generate Mock URL
    //TODO Mock URL = API Path
    const url = new URL(this.mockPrefix.replace(/(?<!:)\/{2,}/g, '/'), 'https://github.com/');
    if (mock?.createWay === 'custom' && mock.uuid) {
      url.searchParams.set('mockID', mock.uuid + '');
    }
    return decodeURIComponent(url.toString());
  }
}