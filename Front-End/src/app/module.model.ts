
import { Module_Child } from './module_child.model';

export class Module {
  _id : string;
  icono : string;
  _nombre : string;
  modulos : Module_Child[];
}
