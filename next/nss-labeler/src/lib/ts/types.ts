export interface TRA {
  cat: string;
  def: string;
}

export interface NSSCode {
  nss_code: number;
  nss_description: string;
  bns_code: string;
  bns_description: string;
  tra_items: string[];
}

export interface UnlabeledData {
  flip_id: number;
  product_name: string;
  brand: string | null;
  ingredients: string;
  tra_cat: string | null;
  tra_item: string | null;
}

export interface LabeledData {
  nssCode: NSSCode;
  data: UnlabeledData;
}

export interface LabelDataset {
  datasetName: string;
  tra_item: string;
  tra_item_description: string;
  unlabeledData: UnlabeledData[];
  labeledData: LabeledData[];
}

export const itemIsLabeled = (
  item: UnlabeledData | LabeledData,
): item is LabeledData => !!(item as LabeledData).nssCode;
