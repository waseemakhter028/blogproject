export interface Category {
  id: number;
  name: string;
  SubCategories: SubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface SideBarProps { 
    categories: Category[];
    filterData: (value: Codes[]) => void;
    setContentLoader: (value: boolean) => void;
    getData: () => void;
}

export interface PagesType {
  current_page: number;
  per_page: number;
  total: number;
}

export interface Codes {
  id: number;
  sub_category_id: number;
  image: string;
  title: string;
  description: string;
  language: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  type: string;
  data: number[];
}

export interface CardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  title: string;
  link: string;
}

export interface NotificationProps {
  show: boolean;
  message: string;
  variant: string;
}