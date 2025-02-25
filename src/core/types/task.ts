

export interface TaskClass {

  image: string;
  title: string;
  desc: string;
  priority: string;    //low , medium , high
  dueDate: Date

}

export interface TaskResponse {

  // array of these

  _id: string;
  image: string;
  title: string;
  desc: string;
  priority: string;
  status: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number
}

export class uploadResponse {
  image: string
}


