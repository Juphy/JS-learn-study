## 安装
> 直接使用

```
<script lang="javascript" src="xlsx.full.min.js"></script>
```
> 使用npm

```
npm install xlsx
```
> 老版本浏览器

```
<!-- add the shim first -->
<script type="text/javascript" src="shim.min.js"></script>
<!-- after the shim is referenced, add the library -->
<script type="text/javascript" src="xlsx.full.min.js"></script>
```

## Angular 2+

```
import * as XLSX from 'xlsx';
```
> sheet_to_json

```
/* <input type="file" (change)="onFileChange($event)" multiple="false" /> */

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
    };
    reader.readAsBinaryString(target.files[0]);
  }

```

> 结合Ant Design使用

```
/*
<nz-upload [nzBeforeUpload]="beforeUpload">
   <button nz-button>导入文件</button>
</nz-upload>
*/

reader: FileReader = new FileReader();

constructor(){
    this.reader.onloadstart=()=>{

    }

    this.reader.onload = (e: any)=>{
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
    }

    this.header.onloadend = () =>{

    }
}

beforeUpload = (file: UploadFile): boolean => {
  this.reader.readAsBinaryString(this.file);
  return false;
}

```
> json_to_sheet/aoa_to_sheet

```
/* generate worksheet */
const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

/* generate workbook and add the worksheet */
const wb: XLSX.WorkBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

/* save to file */
XLSX.writeFile(wb, 'SheetJS.xlsx');

或者使用file-saver中的saveAs

import {saveAs} from 'file-save

const wbout: string = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'binary'});

const s2ab = (s: any) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
};

saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), 'sheetJS.xlsx');

```

## XMLHttpRequest and fetch

> GET

```
let xhr = XMLHttpRequest();
req.open('GET', 'sheetjs.xlsx', true);
req.onload = function(e){
    此时req.response是一个ArrayBuffer，通过new Uint8Array()创建不带符号整数的Uint8Array构造函数。
    let data = new Uint8Array(req.response);
    let wb = XLSX.read(data, {type: "array"});
    document.getElementById('xxx').innerHTML = XLSX.units.sheet_to_html(wb.Sheets[wb.SheetNames[0]],{editable: true}).replace("<table",'<table id="table" border="1"');
}
req.send();
```

> POST

```
let wb = XLSX.utils.table_to_book(document.getElementById('xxx'));
let fd = new FormData();
let data = XLSX.write(wb, {bookType: '文件格式', type: 'array'});
fd.append('data', new File([data], '文件名'+'.'+'文件格式(csv, xlsx, xls等)'));
req.open('POST', url, true);
req.send(fd);
```

> 在angular2+中使用

```
this.http.get('sheetjs.xlsx', {responseType: 'arraybuffer'}).subscribe(res =>{
    console.log(res);   // res是ArrayBuffer
})
```

```
let wb = XLSX.utils.table_to_book(document.getElementById('xxx'));
let fd = new FormData();
let data = XLSX.write(wb, {bookType: '文件格式', type: 'array'});
fd.append('data', new File([data], '文件名.格式名'));
this.http.post('url', fd, {'responseType': 'blob'或者'arraybuffer'}).subscribe(res =>{
   console.log(res);
})
```

nodejs后端：
```
app.post('/upload', (req, res) =>{
    res.header('Access-Control-Allow-Origin', '*');
    let f = req.files[Object.keys(req.files)[0]];
    // f.name 生成的excel的名字和格式
    let newpath = path.join(__dirname, f.name); // 定义新文件所在的位置
    fs.renameSync(f.path, newpath);
    re.end('xx');
})
```

## 其他使用功能

> 修改某一单元的数据，合并单元格问题

```
const ws: any = XLSX.utils.json_to_sheet(data);
// 修改填充的数据
ws['A1']={t: 's', v: '需要填写的内容'};
ws['A2']={t: 's', v: '需要填写的内容'};
ws['A3']={t: 's', v: '需要填写的内容'};

// 合并单元格
/*
c: 代表纵向，从0开始
r: 代表横向，从0开始
*/
ws['!merges']=[
    {
    s: {c: 0, r: 0},
    e: {c: 10, r: 0}
    },
    {
    s: {c: 1, r: 0},
    e: {c: 1, r: 10}
    }
]
```
> 单元格


|Key| Description|
|:---:|:---:|
|v|原始值|
|w|格式化文本|
|t|type: b Boolean, e Error, n Number, d Date, s Text, z Stub|

> 多种导出形式

```
> Importing:
aoa_to_sheet converts an array of arrays of JS data to a worksheet.
json_to_sheet converts an array of JS objects to a worksheet.
table_to_sheet converts a DOM TABLE element to a worksheet.
sheet_add_aoa adds an array of arrays of JS data to an existing worksheet.
sheet_add_json adds an array of JS objects to an existing worksheet.

> Exporting:
sheet_to_json converts a worksheet object to an array of JSON objects.
sheet_to_csv generates delimiter-separated-values output.
sheet_to_txt generates UTF16 formatted text.
sheet_to_html generates HTML output.
sheet_to_formulae generates a list of the formulae (with value fallbacks).

> Cell and cell address manipulation:
format_cell generates the text value for a cell (using number formats).
encode_row / decode_row converts between 0-indexed rows and 1-indexed rows.
encode_col / decode_col converts between 0-indexed columns and column names.
encode_cell / decode_cell converts cell addresses.
encode_range / decode_range converts cell ranges.
```

[详细使用SheetJS](https://github.com/SheetJS/js-xlsx)


