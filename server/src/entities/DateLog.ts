import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("date_log", { schema: "test" })
export class DateLog {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("timestamp", { name: "log_at", default: () => "CURRENT_TIMESTAMP" })
  logAt: Date;
}
