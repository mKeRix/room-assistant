import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class IntegrationsModule {
  public static async register(ids: string[]): Promise<DynamicModule> {
    const modules = await IntegrationsModule.resolveModules(ids);

    return {
      module: IntegrationsModule,
      imports: modules
    };
  }

  private static resolveModules(ids: string[]): Promise<DynamicModule[]> {
    const loadedModules: Array<Promise<DynamicModule>> = [];
    ids.forEach(id => {
      const loadPromise = IntegrationsModule.loadModule(
        `./${id}/${id}.module`
      ).then(module => module.default.forRoot());
      loadedModules.push(loadPromise);
    });

    return Promise.all(loadedModules);
  }

  private static loadModule(path: string): Promise<any> {
    return import(path);
  }
}
