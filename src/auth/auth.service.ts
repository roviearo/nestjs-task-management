import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { PrismaService } from "./../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (user) throw new ConflictException("Username already exist");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.prismaService.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Please check your username & password");
    }
  }

  findOne(username: string) {
    return this.prismaService.user.findUnique({ where: { username } });
  }
}
