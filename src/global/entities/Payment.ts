import { Column, Entity } from "typeorm";

@Entity("payment", { schema: "mydocker03" })
export class Payment {
  @Column("varchar", { primary: true, name: "id", length: 36 })
  id: string;

  @Column("int", { name: "amount" })
  amount: number;
}
