export interface IPattern {
    id?: number | null;
    category: string;
    image: string | null;
    pattern_number: string;
    name: string;
    brand: string;
    outer_material: string;
    lining_material: string;
    submittied: boolean;
    created_at: Date | null;
    updated_at: Date | null
  }
  
  export class Pattern implements IPattern {
    public id?: number | null;
    public category: string;
    public image: string | null;
    public pattern_number: string;
    public name: string;
    public brand: string;
    public outer_material: string;
    public lining_material: string;
    public submittied: boolean;
    public created_at: Date | null;
    public updated_at: Date | null;
    constructor(){
        this.id = null;
        this.category = "";
        this.image = "";
        this.pattern_number = "";
        this.name = "";
        this.brand = "";
        this.outer_material ="";
        this.lining_material = "";
        this.submittied = false;
        this.created_at = null,
        this.updated_at = null
    }
  }
  