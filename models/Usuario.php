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
      // $user = get_current_user();
      $response = [];
      $hour = date('H:m');
      if ($hour > '07:30' && $hour < '18:00') {
         $domain = 'amseq.pe';
         $dn = 'dc=amseq,dc=pe';
         $ldaprdn = trim($usuario) . '@' . $domain;
         $ldapport = 389;
         $ldap = ldap_connect($domain, $ldapport);
         ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
         ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);
         $ldapbind = @ldap_bind($ldap, $ldaprdn, $password);
         if ($ldapbind) {
            $filter = "(sAMAccountName=$usuario)";
            $result = ldap_search($ldap, $dn, $filter);
            $info = ldap_get_entries($ldap, $result);
            for ($i = 0; $i < $info['count']; $i++) {
               if ($info['count'] > 1)
                  break;
               // $unidadOrganizativa = substr(explode(',', $info[$i]['distinguishedname'][0])[1], 3);
               $lastname = strtoupper($info[$i]['sn'][0] ?? '');
               $name = strtoupper($info[$i]['givenname'][0] ?? '');
               $account = $info[$i]['samaccountname'][0] ?? '';
               $empresa = $info[$i]["company"][0] ?? '';
               $area = $info[0]["department"][0] ?? '';
               $celular = $info[0]["telephonenumber"][0] ?? '';
               $correo = $info[0]["mail"][0] ?? '';
               $puesto = $info[$i]["title"][0] ?? '';
               $sede = $info[$i]["postalcode"][0] ?? '';
               $ciudad = $info[$i]["l"][0] ?? '';
               if (session_status() == PHP_SESSION_NONE) {
                  session_start();
               }
               $usuario = (object) [
                  'usuario' => $account,
                  'nombre' => $name,
                  'apellidos' => $lastname,
                  'empresa' => $empresa,
                  'sede' => $sede,
                  'ciudad' => $ciudad,
                  'area' => $area,
                  'puesto' => $puesto,
                  'celular' => $celular,
                  'correo' => $correo
               ];
               $_SESSION['ga-usuario'] = $usuario->usuario;
               $_SESSION['ga-nombres'] = $usuario->nombre;
               $_SESSION['ga-sede'] = $usuario->sede;
               $_SESSION['ga-ciudad'] = $usuario->ciudad;
               $_SESSION['ga-area'] = $usuario->area;
               $_SESSION['ga-puesto'] = $usuario->puesto;
               $response = [
                  'success' => true,
                  'message' => 'Inicio de sesión exitoso'
               ];
            }
         } else {
            $response = [
               'success' => false,
               'message' => 'Credenciales inválidas o su usuario está bloqueado. Si sus datos son correctos, consulte con TI.'
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

   public function guardarToken(string $token, string $usuario, string $perfil): int| bool
   {
      if (in_array($perfil, ['TIC', 'PLANEAMIENTO', 'ALMACENES'])) {
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
