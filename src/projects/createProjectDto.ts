import { IsNotEmpty } from 'class-validator';
import {Client} from "../clients/client.entity";

export class CreateProjectDto {
  @IsNotEmpty() name: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty() deadline: string;
  @IsNotEmpty() client: Client;
}
