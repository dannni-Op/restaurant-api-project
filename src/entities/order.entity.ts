import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from './payment.entity';
import { User } from './user.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'total_price', type: 'int', nullable: false })
  totalPrice: number;

  @Column({ name: 'total_paid', type: 'int', nullable: false })
  totalPaid: number;

  @Column({ name: 'total_return', type: 'int', nullable: false })
  totalReturn: number;

  @Column({ name: 'receipt_code', type: 'varchar', nullable: false })
  receiptCode: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'current_timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'current_timestamp',
    onUpdate: 'current_timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => Payment, (payment) => payment.orders)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
