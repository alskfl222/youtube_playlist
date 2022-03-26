import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlayerList } from "./PlayerList";
import { ChatPlayer } from "./ChatPlayer";

@Entity("player", { schema: "ypdb" })
export class Player {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("timestamp", { name: "added_at", default: () => "CURRENT_TIMESTAMP" })
  addedAt: Date;

  @OneToMany(() => PlayerList, (playerList) => playerList.player)
  playerLists: PlayerList[];

  @OneToMany(() => ChatPlayer, (chatPlayer) => chatPlayer.player)
  chatPlayers: ChatPlayer[];
}
