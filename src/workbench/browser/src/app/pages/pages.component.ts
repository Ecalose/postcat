import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services';

@Component({
  selector: 'eo-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  model = [
    {
      status: 'solved',
      input: 'i am input test',
      select: 'string',
    },
    {
      status: 'solved',
      select: 'number',
    },
  ];
  setting = {
    columnResizable: true, //可改变列宽
    rowSortable: true, //可拖动排序行，默认 false
    isLevel: true, //树
    toolButton: {
      fullScreen: true, //是否可以全屏
      columnVisible: true, //列表项配置
    }, //[false|object]
  };
  columns = [
    {
      type: 'sort',
      width: 60,
    },
    {
      title: '输入框',
      type: 'input',
      placeholder: '请输入...',
      width: 150,
      columnFixed: true, //固定显示，不能被列表项操作
      key: 'input',
      errorTip: '这是错误提示', //string | TemplateRef<void>
    },
    {
      title: 'select',
      key: 'select',
      width: 150,
      type: 'select', //默认 Text/checkbox/sort/input/btn/autoComplete
      filters: true,
      resizeable: false, //如果 setting.columnResizable 为 true，默认 true
      enums: [
        { title: 'string', value: 'string' },
        { title: 'number', value: 'number' },
      ], //筛选项&渲染
      onFilter: () => {},
    },
    {
      title: '状态',
      key: 'status',
      width: 300,
      type: 'text', //默认 Text/checkbox/sort/input/btn/autoComplete
      filters: true,
      enums: [
        { title: '已解决', value: 'solved' },
        { title: '处理中', value: 'pending' },
      ], //筛选项&渲染
      onFilter: () => {},
    },
    {
      type: 'btnList',
      right: true, //是否固定在右边
      btns: [
        {
          type: 'addChild', //add|addChild|delete
          title: '添加子字段',
        },
        {
          title: '更多设置',
          click: (item) => {},
        },
      ],
    },
  ];
  fn() {
    console.log('fn works');
  }
  isShowNotification;
  constructor(public electron: ElectronService) {
    this.isShowNotification = false;
  }
  ngOnInit(): void {}
}
