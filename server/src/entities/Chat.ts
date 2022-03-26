import {
  Index,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { ChatPlayer } from './ChatPlayer';

@Index('user_id', ['userId'], {})
@Entity('chat', { schema: 'ypdb' })
export class Chat {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column('timestamp', { name: 'added_at', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;

  @ManyToOne(() => User, (user) => user.chat, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;

  @OneToMany(() => ChatPlayer, (chatPlayer) => chatPlayer.chat)
  chatPlayers: ChatPlayer[];
}
