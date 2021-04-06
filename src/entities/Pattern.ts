export interface Pattern {
  title: string,
  description: string,
  params: PatternOne | PatternTwo | PatternThree | PatternFour | PatternFive
  }
  
  export interface PatternOne {
  photos: [string],
  answer: string
  }
  
  export interface PatternTwo {
  text: string,
  answers: [string]
  }
  
  export interface PatternThree {
  sound: string,
  answers: [string]
  }
  
  export interface PatternFour {
  sound: string,
  answer: string
  }
  
  export interface PatternFive {
  text: string,
  answers: [string]
  }