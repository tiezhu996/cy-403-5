import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RoleGuard } from './guard/role.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SwitchRoleDto } from './dto/switch-role.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(RoleGuard)
  me(@Req() req: any) {
    return this.authService.me(req.user.id);
  }

  @Patch('switch-role')
  @UseGuards(RoleGuard)
  switchRole(@Body() dto: SwitchRoleDto, @Req() req: any) {
    return this.authService.switchRole(req.user.id, dto.role);
  }
}

