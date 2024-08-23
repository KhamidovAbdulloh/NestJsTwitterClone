import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { MainSeeder } from '../db/seeding/main.seeder';
import { dataSourceOptions } from './data-source';


const options: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  seeds: [MainSeeder],
};

const SeedDataSource = new DataSource(options);

SeedDataSource.initialize().then(async () => {
  await runSeeders(SeedDataSource);
  process.exit();
});
