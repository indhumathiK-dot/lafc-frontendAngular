import { StartupService } from "./startup.service";

export function startupFactory(startupService: StartupService) {
  return () => startupService.getAuthToken();
}
