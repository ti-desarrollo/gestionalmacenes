<?php
require_once('Conexion.php');

class Usuario extends Conexion
{

   public function __construct()
   {
      parent::__construct();
   }

   public function login(string $usuario, string $password): array
   {

      $query = "SELECT 
                  T0.id
                  ,T0.usuario
                  ,T0.naUsuario
                  ,T0.idSede
                  ,T1.descripcion AS descSede
                  ,T0.idPerfil
                  ,CASE T0.idPerfil 
                     WHEN 1 THEN 'SA' 
                     WHEN 2 THEN 'Administrador de tienda'
                     WHEN 3 THEN 'Almacenero' 
                     ELSE 'Jefe de almacén '
                  END AS perfil
               FROM usuarios T0
               INNER JOIN sedes T1 ON T0.idSede = T1.id
               WHERE 
                  T0.usuario = ? COLLATE Latin1_General_CS_AS AND 
                  T0.password = ? COLLATE Latin1_General_CS_AS AND
                  T0.estado = 1";
      return $this->returnQuery($query, [$usuario, $password]);
   }

   public function guardarToken(string $token, string $usuario, string $perfil): int| bool
   {
      if (in_array($perfil, ['1', '4'])) {
         $query = "UPDATE usuarios SET tokenfcm = ? WHERE usuario = ?";
         return $this->simpleQuery($query, [$token, $usuario]);
      }
      return 0;
   }

   public function leerToken(): array
   {
      return $this->returnQuery("SELECT ISNULL(tokenfcm, '') AS tokenfcm, correo FROM usuarios WHERE correo IS NOT NULL AND idPerfil = 4", []);
   }
}
