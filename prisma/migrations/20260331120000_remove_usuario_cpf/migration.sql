-- Remove índice único parcial e coluna cpf de usuario
DROP INDEX IF EXISTS "usuario_cpf_key";
ALTER TABLE "usuario" DROP COLUMN IF EXISTS "cpf";
