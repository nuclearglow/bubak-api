import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';

export const KonziSchema = new Schema(
    {
        date: {
            type: Date,
            index: true,
            required: true
        },
        title: {
            type: String,
            lowercase: false,
            trim: true,
            index: true,
            required: true
        },
        description: {
            type: String,
            lowercase: false,
            trim: true,
            index: true
        },
        flyer: {
            type: String,
            lowercase: true,
            trim: true
        }
    },
    { collection: 'konzis' }
);

// UserSchema.pre('save', function (next) {
//     if (!this.isNew) {
//         next();
//     }

//     email({
//         type: 'welcome',
//         email: this.email
//     })
//         .then(() => {
//             next();
//         })
//         .catch((err) => {
//             logger.error(err);
//             next();
//         });
// });

// UserSchema.pre('findOneAndUpdate', function (next) {
//     if (!this._update.recoveryCode) {
//         return next();
//     }

//     email({
//         type: 'password',
//         email: this._conditions.email,
//         passcode: this._update.recoveryCode
//     })
//         .then(() => {
//             next();
//         })
//         .catch((err) => {
//             logger.error(err);
//             next();
//         });
// });

KonziSchema.plugin(timestamps);
KonziSchema.plugin(mongooseStringQuery);

KonziSchema.index({ date: 1 });

export default mongoose.model('Konzi', KonziSchema);
