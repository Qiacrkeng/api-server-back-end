export interface SqlQueryResult {
  length: number;
  [index: number]: any;
  /**
   * 受影響的行數
   */
  affectedRows: number;
}
export interface TableEvUsers {
  id?: number;
  password?: string;
  nickname?: string;
  email?: string;
  user_pic?: string;
}
export interface TableEvArticleCates {
  id?: number;
  name?: string;
  /**
   * 文章別名
   */
  alias?: string;
  isDelete?: 0 | 1;
}
export interface TableEvArticles {
  id?: number;
  title?: string;
  content?: string;
  cover_img?: string;
  pub_date?: Date;
  state?: string;
  is_delete?: 0 | 1;
  author_id?: number;
  cate_id?: number;
}
