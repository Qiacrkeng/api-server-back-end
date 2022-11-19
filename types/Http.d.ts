export interface HttpBody {
  username: string;
  password: string;
}
export interface HttpSend<SendData = any> {
  status: 0 | 1;
  message: string;
  token?: string;
  data?: SendData;
  maxCount?: number;
}
