import User from '../database/model/user.model';

export interface IIngredient {
  amount: string;
  name: string;
}

export interface IRecipeTip {
  text: string;
  image: string;
  // like: string; // TODO, should be a seperate document
  // comment: string; // TODO, should be a seperate document
  user: User;
}
