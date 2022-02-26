import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("quota", { schema: "ypdb" })
export class Quota {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "Primary Key" })
  id: number;

  @Column("datetime", {
    name: "date_utc",
    nullable: true,
    comment: "Count Period",
  })
  dateUtc: Date | null;

  @Column("int", {
    name: "quota",
    nullable: true,
    comment: "Youtube API quota",
  })
  quota: number | null;
}
