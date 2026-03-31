# Remoção da coluna `cpf` em `usuario`

**Data:** 2026-03-31

## O que foi feito

1. **Migration** `20260331120000_remove_usuario_cpf`: `DROP INDEX IF EXISTS "usuario_cpf_key"` e `ALTER TABLE "usuario" DROP COLUMN IF EXISTS "cpf"`.
2. **Prisma:** campo `cpf` removido do model `usuario` em `schema.prisma`.
3. **API:**
   - `RegisterClientDto`: removido campo `cpf`.
   - `AuthService`: removidas validação de unicidade de CPF, persistência e exposição em `AuthResponse` / `buildAuthResponse`.
   - `UpdateProfileDto` e `UsersService`: removidos `cpf` e validação de unicidade no perfil.
4. **Seed:** cliente de exemplo sem `cpf`.

## Melhorias / impacto

- **Contrato:** o front deve deixar de enviar `cpf` no registro de cliente e no PATCH de perfil; respostas de auth e usuário não incluem mais `cpf`.
- **Integridade:** unicidade de e-mail e CRECI (corretor) permanece; CPF não é mais dado sensível armazenado nesta tabela.

## Próximos passos sugeridos

- Atualizar documentação de testes manuais / coleções Postman que ainda mencionem CPF.
- Se houver front-end dependente do campo, alinhar deploy com esta API.
