import concurrently from 'concurrently';
import * as path from 'path';
import { PROJECTS } from '../registry';

const absPath = (p: string) => path.resolve(__dirname, p);

const commands = PROJECTS.map((project: string) => ({
    command: `ts-node ${absPath('./run.ts')} ${project}`,
    name: project
}));

concurrently(commands)