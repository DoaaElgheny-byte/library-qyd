
export class ValidationPattern {
  static  Email = /^[0-9]{9}|[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5}/;
  static Password=/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\)\(])(?=.{8,})/
  static Mobile = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
  static EnglishOnly = /^[a-zA-Z0-9 ]*$/
  static arabicOnly = /^[\u0621-\u064A0-9 ]*$/
  static allNumber =/^[0-9\u0660-\u0669]+$/
}
