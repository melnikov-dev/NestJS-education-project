import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Genre {
    ACTION = 'action',
    COMEDY = 'comedy',
    DRAMA = 'drama',
    FANTASY = 'fantasy',
}

@Entity({
    name: 'movies'
})
export class MovieEntity {
    @PrimaryColumn()
    @Generated('increment')
    id: number

    @Column({
        type: 'varchar',
        length: 128
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'decimal',
        precision: 2,
        scale: 1,
        default: 0,
    })
    rating: number;

    @Column({
        type: 'enum',
        enum: Genre,
        nullable: true,
    })
    ganre: Genre;

    @Column({
        name: 'is_released',
        type: 'boolean',
        default: false
    })
    isReleazed: boolean;

    @CreateDateColumn({
        name: 'created_at'
    })
    createAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;
}