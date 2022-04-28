import {InferSubjects, Ability, AbilityClass, AbilityBuilder, ExtractSubjectType} from '@casl/ability'
import {UserProfile} from '../profiles/profiles.entity'
import {User} from '../users/user.entity'
import {Action} from '../enums/action.enum'
import {Injectable} from '@nestjs/common'

// subject models [entities]
type Subjects = InferSubjects<typeof User| typeof UserProfile> | 'all';

// defining application ability to execute actions on subjects
export type AppAbility = Ability<[Action, Subjects]>;


@Injectable()
export class CaslAbilityFactory {
    
    // defining permissions for user profile
    createForUser(userEntity: User) {

        const {can, cannot, build} = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)
        
        /**
         * actions that can be performed on resource if user role is admin
         */
        if (userEntity.role === 'Admin') { // user is admin
            can(Action.Manage, 'all'); // read-write access to every resource
        } else {
            can(Action.Read, 'all'); // read-only access to every resource
        }

        /**
         * adding extra actions for specific resources
         * 
         * give permission to update profile if it was created by its user
         * give permission to delete profile if it was created by its user
         */
        can(Action.Update, UserProfile, {user: userEntity});
        can(Action.Delete, UserProfile, {user: userEntity})
        

        // return the build of ability and actions on subjects
        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}