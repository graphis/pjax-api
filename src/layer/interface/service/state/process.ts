import { Supervisor } from 'spica';

export const process = new class extends Supervisor<'', Error, void, void> { }();