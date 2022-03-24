import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlayerList } from "./PlayerList";

@Entity("player", { schema: "ypdb" })
export class Player {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("timestamp", { name: "added_at", default: () => "CURRENT_TIMESTAMP" })
  addedAt: Date;

  @OneToMany(() => PlayerList, (playerList) => playerList.player)
  playerLists: PlayerList[];
}
