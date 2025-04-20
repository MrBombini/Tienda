export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Country {
  sISOCode: string;
  sName: string;
}

export interface CountryInfo {
  sISOCode: string;
  sName: string;
  sCapitalCity: string;
  sPhoneCode: string;
  sContinentCode: string;
  sCurrencyISOCode: string;
  sCountryFlag: string;
  Languages?: {
    tLanguage: Array<{
      sISOCode: string;
      sName: string;
    }>;
  };
}