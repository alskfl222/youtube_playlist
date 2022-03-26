import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./Chat";
import { Player } from "./Player";

@Index("chat_id", ["chatId"], {})
@Index("player_id", ["playerId"], {})
@Entity("chat_player", { schema: "ypdb" })
export class ChatPlayer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "player_id" })
  playerId: number;

  @Column("int", { name: "chat_id" })
  chatId: number;

  @ManyToOne(() => Player, (player) => player.chatPlayers, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "player_id", referencedColumnName: "id" }])
  player: Player;

  @ManyToOne(() => Chat, (chat) => chat.chatPlayers, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "chat_id", referencedColumnName: "id" }])
  chat: Chat;
}
