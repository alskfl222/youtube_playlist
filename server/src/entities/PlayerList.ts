import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Player } from "./Player";
import { List } from "./List";

@Index("list_id", ["listId"], {})
@Index("player_id", ["playerId"], {})
@Entity("player_list", { schema: "ypdb" })
export class PlayerList {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "player_id" })
  playerId: number;

  @Column("int", { name: "list_id" })
  listId: number;

  @ManyToOne(() => Player, (player) => player.playerLists, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "player_id", referencedColumnName: "id" }])
  player: Player;

  @ManyToOne(() => List, (list) => list.playerLists, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "list_id", referencedColumnName: "id" }])
  list: List;
}
