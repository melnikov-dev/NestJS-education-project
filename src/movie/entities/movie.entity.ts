import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'movies'
})
export class MovieEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string;

    @Column()
    isReleased: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}