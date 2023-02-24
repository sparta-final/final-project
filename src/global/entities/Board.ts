import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("board", { schema: "mydocker03" })
export class Board {
  @PrimaryGeneratedColumn({ type: "int", name: "number" })
  number: number;

  @Column("varchar", { name: "writer", length: 255 })
  writer: string;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("varchar", { name: "contents", length: 255 })
  contents: string;
}
