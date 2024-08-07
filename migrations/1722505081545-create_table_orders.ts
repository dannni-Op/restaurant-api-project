import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTableOrders1722505081545 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'payment_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'total_price',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_paid',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'total_return',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'receipt_code',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            onUpdate: 'now()',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'fk_orders_userId',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'fk_orders_paymentId',
        columnNames: ['payment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'payments',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropForeignKey('orders', 'fk_orders_userId');
    // await queryRunner.dropForeignKey('orders', 'fk_orders_paymentId');
    await queryRunner.dropTable('orders', true);
  }
}
