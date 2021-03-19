import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from 'src/app/Services/student-service.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
type AOA = any[][];

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {


  //#region Array Variables
  filesToUpload: Array<File>;
  selectedFileNames: string[] = [];
  data = [];
  SavingForm = [];
  DbRecords = [];
  //#endregion

  //#region Boolean Variables
  File: boolean = false;
  flag5:boolean;
  showTable:boolean=false;
  DBrecordFlag:boolean;
  //#endregion

  constructor(
    private studentService:StudentServiceService,
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getDataFromDb();
  }

  public removeRecord(values) {
    Swal.fire({
      title: "Do you want Delete",
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      confirmButtonColor: '#8CD4F5',
      cancelButtonColor: '#C1C1C1',

    }).then((data) => {

      if (data.value) {
        this.SavingForm.splice(values, 1);
      }
      else {
        return;
      }

    });
  }

  public onFileChange(evt: any) {
    debugger
        this.DBrecordFlag = false;
        this.SavingForm = [];
        this.flag5 = false;
        this.filesToUpload = <Array<File>>evt.target.files;
        for (let i = 0; i < this.filesToUpload.length; i++) {
          this.selectedFileNames.push(this.filesToUpload[i].name);
        }
        this.SpinnerService.show();

        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
    
          /* read workbook */
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
          /* grab first sheet */
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          /* save data */
          this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { raw: true }));
          for (let d = 0; d < this.data.length; d++) {
            let obj =
            {
              
              
              name: this.data[d].Name.toString(),
              age: +this.data[d].Age,
              city: this.data[d].City.toString(),
              status : 3              
            }
            this.SavingForm.push(obj);
           
          }
        };
        reader.readAsBinaryString(target.files[0]);
        this.SpinnerService.hide();
      }

      public FileDisplay(){
        this.flag5 = true;
      }
      public async getDataFromDb(){
        debugger
        let data =   await this.studentService.StudentGetDetails().toPromise();
        this.DbRecords = data;
      }

      public Show(value){
        if(this.DbRecords.length>0){
          if(value==1){
            this.showTable = true;
          }
          if(value==2){
            this.showTable = false;
          }
        }
        else{
          this.DBrecordFlag=true;
        }
        
      }

      public async SavingDetails(){
        Swal.fire({
          title: 'Do You Want to Create?',
    
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#8CD4F5',
          cancelButtonColor: '#C1C1C1',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
             this.SavingTODatabase();
          }
          else {
            return;
          }
        });
      }

      public  SavingTODatabase(){
        debugger
        this.studentService.StudentDetails(this.SavingForm).subscribe((result: any) => {
          debugger;
          Swal.fire({
            icon: 'success',
            title: 'Created Successfully',
            showConfirmButton: true,
          });
          this.flag5=false;
          this.getDataFromDb();
        });
        debugger
      }

}
