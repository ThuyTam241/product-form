import type { Dayjs } from "dayjs";
import type { Category } from "../enums/category.enum";
import type { Status } from "../enums/status.enum";

export interface Product {
  readonly id: string;
  name: string;
  thumbnail?: string;
  quantity: number;
  provider: string;
  category: Category;
  price: number;
  expiredAt?: string | Dayjs;
  tags?: string[];
  status: Status;
}
