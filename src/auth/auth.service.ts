import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { PrismaService } from "./../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    // private repo: Repository<User>,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    authCredentialsDto: AuthCredentialsDto,
    data: Prisma.UserCreateInput,
  ): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.prismaService.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    try {
      await this.prismaService.save(user);
    } catch (error) {
      //   console.log(error.code);
      if (error.code === "23505") {
        // Duplicate username
        throw new ConflictException("Username already exist");
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.prismaService.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Please check your username & password");
    }
  }
}
