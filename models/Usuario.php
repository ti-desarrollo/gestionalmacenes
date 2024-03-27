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
      $response = [];
      $hour = date('H:i');
      if ($hour > '07:30' && $hour < '18:00') {
         $query = "SELECT 
                  T0.id AS 'codigo'
                  ,T0.usuario AS 'usuario'
                  ,T0.naUsuario AS 'nombres'
                  ,T0.idSede AS 'sede'
                  ,T1.descripcion AS 'ciudad'
                  ,T0.idPerfil
                  ,CASE T0.idPerfil
                     WHEN 1 THEN 'SISTEMAS'
                     WHEN 2 THEN 'ADMINISTRADOR TIENDA'
                     WHEN 3 THEN 'RESPONSABLE DE ALMACEN'
                     WHEN 4 THEN 'ALMACENES'
                     WHEN 5 THEN 'MESA DE PARTES'
                     WHEN 6 THEN 'LOGISTICA'
                  END AS 'area'
                  ,T0.correo AS 'correo'

               FROM usuarios T0
               INNER JOIN sedes T1 ON T0.idSede = T1.id
               WHERE 
                  T0.usuario = ? COLLATE Latin1_General_CS_AS AND 
                  T0.password = ? COLLATE Latin1_General_CS_AS AND
                  T0.estado = 1";
         $data = $this->returnQuery($query, [$usuario, $password]);
         if (sizeof($data) == 1) {
            $_SESSION['ga-usuario'] = $data[0]['usuario'];
            $_SESSION['ga-nombres'] = $data[0]['nombres'];
            $_SESSION['ga-sede'] = $data[0]['sede'];
            $_SESSION['ga-ciudad'] = $data[0]['ciudad'];
            $_SESSION['ga-area'] = $data[0]['area'];
            $_SESSION['ga-correo'] = $data[0]['correo'];
            $response = [
               'success' => true,
               'message' => 'Inicio de sesión exitoso'
            ];
         } else {
            $response = [
               'success' => false,
               'message' => 'Credenciales no válidas, por favor intenta otra vez'
            ];
         }
      } else {
         $response = [
            'success' => false,
            'message' => 'Estás fuera del horario permitido para el acceso al sistema'
         ];
      }
      return $response;
   }


   public function abrirSesion(string $usuario, string $area, string $token, string $correo): int| bool
   {
      $host = getenv('COMPUTERNAME');
      if (in_array($area, ['SISTEMAS', 'ALMACENES'])) {
         $sesion = $this->insertQuery('sp_abrirSesion ?, ?, ?, ?, ?', [$usuario, $area, $token, $correo, $host]);
         if ($sesion) {
            $_SESSION['ga-sesion'] = $sesion;
         }
         return $sesion;
      }
      return false;
   }

   public function cerrarSesion(int $sesion = null): int| bool
   {
      return $this->simpleQuery('sp_cerrarSesion ?', [$sesion]);
   }

   public function leerSesiones(): array
   {
      return $this->returnQuery("sp_listarSesiones", []);
   }
}
