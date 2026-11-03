export interface IFaq {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}


export interface ISubmitFaq {
  title: string;
  content: string;
}