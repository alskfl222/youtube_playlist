import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("field", { schema: "test" })
export class Field {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "table_name", length: 32 })
  tableName: string;

  @Column("varchar", { name: "fields", length: 180 })
  fields: string;
}
